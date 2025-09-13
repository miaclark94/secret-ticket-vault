import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_venue",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_date",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_time",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_eventDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_totalTickets",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxPrice",
        "type": "uint256"
      }
    ],
    "name": "createEvent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eventId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "ticketId",
        "type": "uint256"
      }
    ],
    "name": "purchaseTicket",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ticketId",
        "type": "uint256"
      }
    ],
    "name": "useTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "ticketId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Contract address - This would be the deployed contract address
const CONTRACT_ADDRESS = '0x...' as const;

export const useContract = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  const createEvent = useMutation({
    mutationFn: async (eventData: {
      name: string;
      description: string;
      venue: string;
      date: string;
      time: string;
      eventDate: number;
      totalTickets: number;
      maxPrice: number;
    }) => {
      if (!address) throw new Error('Wallet not connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createEvent',
        args: [
          eventData.name,
          eventData.description,
          eventData.venue,
          eventData.date,
          eventData.time,
          eventData.eventDate,
          eventData.totalTickets,
          eventData.maxPrice
        ],
      });
      
      return hash;
    },
    onSuccess: (hash) => {
      toast({
        title: "Event Created",
        description: "Your event has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create event: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const purchaseTicket = useMutation({
    mutationFn: async ({ ticketId, amount }: { ticketId: number; amount: string }) => {
      if (!address) throw new Error('Wallet not connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'purchaseTicket',
        args: [ticketId, amount],
        value: BigInt(amount),
      });
      
      return hash;
    },
    onSuccess: (hash) => {
      toast({
        title: "Ticket Purchased",
        description: "Your ticket has been purchased successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to purchase ticket: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const useTicket = useMutation({
    mutationFn: async (ticketId: number) => {
      if (!address) throw new Error('Wallet not connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'useTicket',
        args: [ticketId],
      });
      
      return hash;
    },
    onSuccess: (hash) => {
      toast({
        title: "Ticket Used",
        description: "Your ticket has been used successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to use ticket: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const transferTicket = useMutation({
    mutationFn: async ({ ticketId, to }: { ticketId: number; to: string }) => {
      if (!address) throw new Error('Wallet not connected');
      
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transferTicket',
        args: [ticketId, to],
      });
      
      return hash;
    },
    onSuccess: (hash) => {
      toast({
        title: "Ticket Transferred",
        description: "Your ticket has been transferred successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to transfer ticket: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return {
    createEvent,
    purchaseTicket,
    useTicket,
    transferTicket,
  };
};

export const useEventInfo = (eventId: number) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEventInfo',
    args: [eventId],
  });
};

export const useTicketInfo = (ticketId: number) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicketInfo',
    args: [ticketId],
  });
};
