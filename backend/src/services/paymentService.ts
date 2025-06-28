import { AuthenticatedClient } from "@interledger/open-payments";
import { 
  createIncomingPayment, 
  createQoute, 
  createOutgoingPayment,
  getOutgoingPaymentAuthorization,
  getWalletAddressInfo,
  getAuthenticatedClient 
} from "./openPaymentsServices";

export class PaymentService {
  private client: AuthenticatedClient | null = null;

  async initializeClient(): Promise<AuthenticatedClient> {
    if (!this.client) {
      this.client = await getAuthenticatedClient();
    }
    return this.client;
  }

  async initiateP2PPayment(
    senderWallet: string, 
    receiverWallet: string, 
    amount: string
  ) {
    const client = await this.initializeClient();
    
    // Get receiver wallet details
    const { walletAddressDetails: receiverDetails } = await getWalletAddressInfo(
      client, 
      receiverWallet
    );
    
    // Create incoming payment
    const incomingPayment = await createIncomingPayment(
      client, 
      amount, 
      receiverDetails
    );
    
    // Get sender wallet details
    const { walletAddressDetails: senderDetails } = await getWalletAddressInfo(
      client, 
      senderWallet
    );
    
    // Create quote
    const quote = await createQoute(
      client, 
      incomingPayment.id, 
      senderDetails
    );
    
    // Get authorization
    const authGrant = await getOutgoingPaymentAuthorization(
      client,
      {
        qouteId: quote.id,
        debitAmount: quote.debitAmount,
        receiveAmount: quote.receiveAmount,
        type: "one_time",
        redirectUrl: `${process.env.BASE_URL}/success`
      },
      senderDetails
    );
    
    return {
      paymentId: incomingPayment.id,
      quoteId: quote.id,
      authorizationUrl: authGrant.interact.redirect,
      continueToken: authGrant.continue.access_token.value,
      continueUri: authGrant.continue.uri
    };
  }

  async completePayment(paymentData: {
    senderWalletAddress: string;
    quoteId: string;
    continueToken: string;
    continueUri: string;
    interactRef: string;
  }) {
    const client = await this.initializeClient();
    
    const { walletAddressDetails } = await getWalletAddressInfo(
      client,
      paymentData.senderWalletAddress
    );
    
    const outgoingPayment = await createOutgoingPayment(
      client,
      {
        senderWalletAddress: paymentData.senderWalletAddress,
        continueAccessToken: paymentData.continueToken,
        quoteId: paymentData.quoteId,
        interactRef: paymentData.interactRef,
        continueUri: paymentData.continueUri
      },
      walletAddressDetails
    );
    
    return outgoingPayment;
  }
}
