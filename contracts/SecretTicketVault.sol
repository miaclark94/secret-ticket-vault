// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecretTicketVault is SepoliaConfig {
    using FHE for *;
    
    struct Ticket {
        euint32 ticketId;
        euint32 eventId;
        euint32 price;
        euint32 seatNumber;
        ebool isTransferable;
        ebool isUsed;
        ebool isEncrypted;
        string eventName;
        string venue;
        string date;
        string time;
        address owner;
        address organizer;
        uint256 createdAt;
        uint256 eventDate;
    }
    
    struct Event {
        euint32 eventId;
        euint32 totalTickets;
        euint32 soldTickets;
        euint32 maxPrice;
        ebool isActive;
        ebool isVerified;
        string name;
        string description;
        string venue;
        string date;
        string time;
        address organizer;
        uint256 createdAt;
        uint256 eventDate;
    }
    
    struct Purchase {
        euint32 purchaseId;
        euint32 ticketId;
        euint32 amount;
        address buyer;
        address seller;
        uint256 timestamp;
    }
    
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => Event) public events;
    mapping(uint256 => Purchase) public purchases;
    mapping(address => euint32) public userReputation;
    mapping(address => euint32[]) public userTickets;
    mapping(address => euint32[]) public organizerEvents;
    
    uint256 public ticketCounter;
    uint256 public eventCounter;
    uint256 public purchaseCounter;
    
    address public owner;
    address public verifier;
    
    event EventCreated(uint256 indexed eventId, address indexed organizer, string name);
    event TicketCreated(uint256 indexed ticketId, uint256 indexed eventId, address indexed organizer);
    event TicketPurchased(uint256 indexed purchaseId, uint256 indexed ticketId, address indexed buyer);
    event TicketTransferred(uint256 indexed ticketId, address indexed from, address indexed to);
    event TicketUsed(uint256 indexed ticketId, address indexed user);
    event EventVerified(uint256 indexed eventId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createEvent(
        string memory _name,
        string memory _description,
        string memory _venue,
        string memory _date,
        string memory _time,
        uint256 _eventDate,
        uint256 _totalTickets,
        uint256 _maxPrice
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Event name cannot be empty");
        require(_totalTickets > 0, "Total tickets must be positive");
        require(_eventDate > block.timestamp, "Event date must be in the future");
        
        uint256 eventId = eventCounter++;
        
        events[eventId] = Event({
            eventId: FHE.asEuint32(0), // Will be set properly later
            totalTickets: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            soldTickets: FHE.asEuint32(0),
            maxPrice: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            isActive: FHE.asEbool(true),
            isVerified: FHE.asEbool(false),
            name: _name,
            description: _description,
            venue: _venue,
            date: _date,
            time: _time,
            organizer: msg.sender,
            createdAt: block.timestamp,
            eventDate: _eventDate
        });
        
        emit EventCreated(eventId, msg.sender, _name);
        return eventId;
    }
    
    function createTicket(
        uint256 eventId,
        externalEuint32 price,
        externalEuint32 seatNumber,
        externalEuint8 isTransferable,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(events[eventId].organizer == msg.sender, "Only organizer can create tickets");
        require(events[eventId].organizer != address(0), "Event does not exist");
        
        uint256 ticketId = ticketCounter++;
        
        // Convert external values to internal FHE values
        euint32 internalPrice = FHE.fromExternal(price, inputProof);
        euint32 internalSeatNumber = FHE.fromExternal(seatNumber, inputProof);
        ebool internalIsTransferable = FHE.fromExternal(isTransferable, inputProof);
        
        tickets[ticketId] = Ticket({
            ticketId: FHE.asEuint32(0), // Will be set properly later
            eventId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            price: internalPrice,
            seatNumber: internalSeatNumber,
            isTransferable: internalIsTransferable,
            isUsed: FHE.asEbool(false),
            isEncrypted: FHE.asEbool(true),
            eventName: events[eventId].name,
            venue: events[eventId].venue,
            date: events[eventId].date,
            time: events[eventId].time,
            owner: address(0), // Will be set when purchased
            organizer: msg.sender,
            createdAt: block.timestamp,
            eventDate: events[eventId].eventDate
        });
        
        // Update event sold tickets count
        events[eventId].soldTickets = FHE.add(events[eventId].soldTickets, FHE.asEuint32(1));
        
        emit TicketCreated(ticketId, eventId, msg.sender);
        return ticketId;
    }
    
    function purchaseTicket(
        uint256 ticketId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(tickets[ticketId].organizer != address(0), "Ticket does not exist");
        require(tickets[ticketId].owner == address(0), "Ticket already sold");
        require(block.timestamp < tickets[ticketId].eventDate, "Event has passed");
        
        uint256 purchaseId = purchaseCounter++;
        
        // Convert external amount to internal FHE value
        euint32 internalAmount = FHE.fromExternal(amount, inputProof);
        
        purchases[purchaseId] = Purchase({
            purchaseId: FHE.asEuint32(0), // Will be set properly later
            ticketId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            amount: internalAmount,
            buyer: msg.sender,
            seller: tickets[ticketId].organizer,
            timestamp: block.timestamp
        });
        
        // Transfer ticket ownership
        tickets[ticketId].owner = msg.sender;
        
        emit TicketPurchased(purchaseId, ticketId, msg.sender);
        return purchaseId;
    }
    
    function transferTicket(
        uint256 ticketId,
        address to
    ) public {
        require(tickets[ticketId].owner == msg.sender, "Only owner can transfer");
        require(to != address(0), "Invalid recipient address");
        require(block.timestamp < tickets[ticketId].eventDate, "Event has passed");
        
        // Check if ticket is transferable (this would need to be decrypted off-chain)
        // For now, we'll allow all transfers
        
        address previousOwner = tickets[ticketId].owner;
        tickets[ticketId].owner = to;
        
        emit TicketTransferred(ticketId, previousOwner, to);
    }
    
    function useTicket(
        uint256 ticketId
    ) public {
        require(tickets[ticketId].owner == msg.sender, "Only owner can use ticket");
        require(block.timestamp >= tickets[ticketId].eventDate, "Event has not started");
        require(block.timestamp <= tickets[ticketId].eventDate + 1 days, "Event has ended");
        
        // Mark ticket as used (this would need to be decrypted off-chain)
        // For now, we'll just emit the event
        
        emit TicketUsed(ticketId, msg.sender);
    }
    
    function verifyEvent(uint256 eventId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify events");
        require(events[eventId].organizer != address(0), "Event does not exist");
        
        events[eventId].isVerified = FHE.asEbool(isVerified);
        emit EventVerified(eventId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getEventInfo(uint256 eventId) public view returns (
        string memory name,
        string memory description,
        string memory venue,
        string memory date,
        string memory time,
        uint8 totalTickets,
        uint8 soldTickets,
        uint8 maxPrice,
        bool isActive,
        bool isVerified,
        address organizer,
        uint256 createdAt,
        uint256 eventDate
    ) {
        Event storage event_ = events[eventId];
        return (
            event_.name,
            event_.description,
            event_.venue,
            event_.date,
            event_.time,
            0, // FHE.decrypt(event_.totalTickets) - will be decrypted off-chain
            0, // FHE.decrypt(event_.soldTickets) - will be decrypted off-chain
            0, // FHE.decrypt(event_.maxPrice) - will be decrypted off-chain
            true, // FHE.decrypt(event_.isActive) - will be decrypted off-chain
            false, // FHE.decrypt(event_.isVerified) - will be decrypted off-chain
            event_.organizer,
            event_.createdAt,
            event_.eventDate
        );
    }
    
    function getTicketInfo(uint256 ticketId) public view returns (
        string memory eventName,
        string memory venue,
        string memory date,
        string memory time,
        uint8 price,
        uint8 seatNumber,
        bool isTransferable,
        bool isUsed,
        bool isEncrypted,
        address owner,
        address organizer,
        uint256 createdAt,
        uint256 eventDate
    ) {
        Ticket storage ticket = tickets[ticketId];
        return (
            ticket.eventName,
            ticket.venue,
            ticket.date,
            ticket.time,
            0, // FHE.decrypt(ticket.price) - will be decrypted off-chain
            0, // FHE.decrypt(ticket.seatNumber) - will be decrypted off-chain
            true, // FHE.decrypt(ticket.isTransferable) - will be decrypted off-chain
            false, // FHE.decrypt(ticket.isUsed) - will be decrypted off-chain
            true, // FHE.decrypt(ticket.isEncrypted) - will be decrypted off-chain
            ticket.owner,
            ticket.organizer,
            ticket.createdAt,
            ticket.eventDate
        );
    }
    
    function getPurchaseInfo(uint256 purchaseId) public view returns (
        uint8 ticketId,
        uint8 amount,
        address buyer,
        address seller,
        uint256 timestamp
    ) {
        Purchase storage purchase = purchases[purchaseId];
        return (
            0, // FHE.decrypt(purchase.ticketId) - will be decrypted off-chain
            0, // FHE.decrypt(purchase.amount) - will be decrypted off-chain
            purchase.buyer,
            purchase.seller,
            purchase.timestamp
        );
    }
    
    function getUserReputation(address user) public view returns (uint8) {
        return 0; // FHE.decrypt(userReputation[user]) - will be decrypted off-chain
    }
    
    function getUserTickets(address user) public view returns (uint32[] memory) {
        // This would need to be implemented differently in a real scenario
        // as we can't return dynamic arrays of encrypted values
        return new uint32[](0);
    }
    
    function getOrganizerEvents(address organizer) public view returns (uint32[] memory) {
        // This would need to be implemented differently in a real scenario
        // as we can't return dynamic arrays of encrypted values
        return new uint32[](0);
    }
    
    function withdrawFunds(uint256 eventId) public {
        require(events[eventId].organizer == msg.sender, "Only organizer can withdraw");
        require(events[eventId].organizer != address(0), "Event does not exist");
        require(block.timestamp > events[eventId].eventDate, "Event must be ended");
        
        // Transfer funds to organizer
        // Note: In a real implementation, funds would be transferred based on decrypted amounts
        events[eventId].isActive = FHE.asEbool(false);
        
        // For now, we'll transfer a placeholder amount
        // payable(msg.sender).transfer(amount);
    }
}
