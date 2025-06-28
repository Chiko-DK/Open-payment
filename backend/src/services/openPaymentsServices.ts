import * as dotenv from "dotenv";
import {
  type WalletAddress,
  type AuthenticatedClient,
  type Grant,
  createAuthenticatedClient,
  type PendingGrant,
  isPendingGrant,
} from "@interledger/open-payments";
import { randomUUID } from "crypto";
import { type components } from "@interledger/open-payments/dist/openapi/generated/auth-server-types";

dotenv.config({ path: ".env" });

export async function getAuthenticatedClient() {
  let walletAddress = process.env.OPEN_PAYMENTS_CLIENT_ADDRESS;
  if (walletAddress && walletAddress.startsWith("$")) {
    walletAddress = walletAddress.replace("$", "https://");
  }

  const client = await createAuthenticatedClient({
    walletAddressUrl: process.env.OPEN_PAYMENTS_CLIENT_ADDRESS ?? "",
    privateKey: process.env.OPEN_PAYMENTS_SECRET_KEY_PATH ?? "",
    keyId: process.env.OPEN_PAYMENTS_KEY_ID ?? "",
  });
  return client;
}

export async function getWalletAddressInfo(
  client: AuthenticatedClient,
  walletAddress: string
): Promise<{ walletAddress: string; walletAddressDetails: WalletAddress }> {
  if (walletAddress.startsWith("$"))
    walletAddress = walletAddress.replace("$", "https://");

  const walletAddressDetails = await client.walletAddress.get({
    url: walletAddress,
  });

  return { walletAddress, walletAddressDetails };
}

/**
 * The method requests a grant from the receivers auth server for creating an incoming payment grant
 * After receiving the grant the incoming payment resource is created
 *
 * @param client
 * @param value - payment amount to be made
 * @param walletAddressDetails - wallet address details for the receiver
 * @returns
 */
export async function createIncomingPayment(
  client: AuthenticatedClient,
  value: string,
  walletAddressDetails: WalletAddress
) {
  console.log(">> Creating Incoming Payment Resource");
  console.log(walletAddressDetails);

  // Request IP grant
  const grant = await client.grant.request(
    {
      url: walletAddressDetails.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "incoming-payment",
            actions: ["read", "create", "complete"],
          },
        ],
      },
    }
  );

  if (isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  if (grant && isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  // Create incoming payment
  const incomingPayment = await client.incomingPayment.create(
    {
      url: new URL(walletAddressDetails.id).origin,
      accessToken: grant.access_token.value,
    },
    {
      walletAddress: walletAddressDetails.id,
      incomingAmount: {
        value: value,
        assetCode: walletAddressDetails.assetCode,
        assetScale: walletAddressDetails.assetScale,
      },
      expiresAt: new Date(Date.now() + 240000 * 30).toISOString(),
    }
  );

  console.log("<< Resource created");
  console.log(incomingPayment);
  return incomingPayment;
}

/**
 * The method requests a grant to create a quote on the senders resource server
 * The quote is then created on the senders resource server
 *
 * @param client
 * @param incomingPaymentUrl - identifier for the incoming payment the quote is being created for
 * @param walletAddressDetails - wallet address details for the sender
 * @returns
 */
export async function createQoute(
  client: AuthenticatedClient,
  incomingPaymentUrl: string,
  walletAddressDetails: WalletAddress
) {
  console.log(">> Creating quote");
  console.log(walletAddressDetails);

  // Request Quote grant
  const grant = await client.grant.request(
    {
      url: walletAddressDetails.authServer,
    },
    {
      access_token: {
        access: [
          {
            type: "quote",
            actions: ["create", "read", "read-all"],
          },
        ],
      },
    }
  );

  if (grant && isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  // Ensure grant is not a PendingGrant before accessing access_token
  if (!grant || isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  // Create quote
  const quote = await client.quote.create(
    {
      url: walletAddressDetails.resourceServer,
      accessToken: grant.access_token.value,
    },
    {
      method: "ilp",
      walletAddress: walletAddressDetails.id,
      receiver: incomingPaymentUrl,
    }
  );

  console.log("<< Quote created");
  console.log(quote);
  return quote;
}

/**
 * This method creates a pending grant which must be authorized by the user
 * After it is authorized the continuation access token we receive can be used to get the actual OP creation grant
 * Tells the client to go ask sender for approval and details of where to come back to continue the process
 *
 * @param client
 * @param input - details from the quote
 * @param walletAddressDetails - wallet address details for the sender
 * @returns
 */
export async function getOutgoingPaymentAuthorization(
  client: AuthenticatedClient,
  input: any,
  walletAddressDetails: WalletAddress
): Promise<PendingGrant> {
  console.log(">> Getting link to authorize outgoing payment grant request");
  console.log(walletAddressDetails);

  const dateNow = new Date().toISOString();
  const debitAmount = input.debitAmount;
  const receiveAmount = input.receiveAmount;

  // Request outgoing payment pending grant
  const grant = await client.grant.request(
    {
      url: walletAddressDetails.authServer,
    },
    {
      access_token: {
        access: [
          {
            identifier: walletAddressDetails.id,
            type: "outgoing-payment",
            actions: ["list", "list-all", "read", "read-all", "create"],
            limits: {
              ...{
                debitAmount: debitAmount,
                receiveAmount: receiveAmount,
              },
              ...(input.type === "new_subscription"
                ? {
                    interval: `R${input.payments}/${dateNow}/${
                      input.duration ?? "PT10M"
                    }`,
                  }
                : {}),
            },
          },
        ],
      },
      interact: {
        start: ["redirect"],
        finish: {
          method: "redirect",
          uri: input.redirectUrl,
          nonce: randomUUID(),
        },
      },
    }
  );

  if (grant && !isPendingGrant(grant)) {
    throw new Error("Expected interactive grant");
  }

  console.log("<< Pending outgoing grant obtained");
  if (isPendingGrant(grant)) {
    return grant;
  }
  throw new Error("Expected interactive grant (PendingGrant), but got Grant.");
}

/**
 * This method will now get the grant if the user has given permission
 * The grant is then used to create the outgoing payment
 *
 * @param client
 * @param input
 * @returns
 */
export async function createOutgoingPayment(
  client: AuthenticatedClient,
  input: any,
  walletAddressDetails: WalletAddress
) {
  let walletAddress = input.senderWalletAddress;
  if (walletAddress.startsWith("$"))
    walletAddress = walletAddress.replace("$", "https://");

  console.log(">> Creating outgoing payment");
  console.log(input);

  // Add debug logging
  console.log(">> Wallet Address Details:");
  console.log(walletAddressDetails);
  console.log(">> Resource Server:", walletAddressDetails.resourceServer);

  // Get the grant since it was still pending
  const grant: PendingGrant | Grant | undefined = (await client.grant.continue(
    {
      accessToken: input.continueAccessToken,
      url: input.continueUri,
    },
    {
      interact_ref: input.interactRef,
    }
  )) as Grant;

  console.log("<< Outgoing payment grant");
  console.log(grant);

  if (grant && isPendingGrant(grant)) {
    throw new Error("Expected non-interactive grant");
  }

  // Add validation to ensure resourceServer exists
  if (!walletAddressDetails.resourceServer) {
    throw new Error("Resource server is undefined in wallet address details");
  }

  // Create outgoing payment
  const outgoingPayment = await client.outgoingPayment.create(
    {
      url: walletAddressDetails.resourceServer,
      accessToken: grant.access_token.value,
    },
    {
      walletAddress: walletAddress,
      quoteId: input.quoteId,
    }
  );

  console.log("<< Outgoing payment created");
  console.log(outgoingPayment);
  return outgoingPayment;
}

/**
 * This method creates an outgoing payment for a recurring payment
 *
 * @param client
 * @param input
 * @returns
 */
export async function processSubscriptionPayment(
  client: AuthenticatedClient,
  input: any
) {
  // rotate the token
  const token = await client.token.rotate({
    url: input.manageUrl,
    accessToken: input.previousToken,
  });

  // Ensure the token is still valid before proceeding
  if (!token.access_token || !token.access_token.value) {
    throw new Error("Access token is missing or invalid.");
  }

  // Check for token expiry and rotate if less than 1 minute remains
  if (
    typeof token.access_token.expires_in === "number" &&
    token.access_token.expires_in <= 60
  ) {
    // Rotate the token again to ensure validity
    const refreshedToken = await client.token.rotate({
      url: input.manageUrl,
      accessToken: token.access_token.value,
    });

    if (!refreshedToken.access_token || !refreshedToken.access_token.value) {
      throw new Error("Failed to refresh access token.");
    }

    token.access_token = refreshedToken.access_token;
    console.log("<< Token rotated again due to imminent expiry");
  }

  if (token.access_token.expires_in && token.access_token.expires_in <= 0) {
    throw new Error("Access token has expired.");
  }

  if (!token.access_token) {
    console.error("!! Failed to rotate token.");
  }

  console.log("<< Rotated Token ");
  console.log(token.access_token);

  const tokenAccessDetails = token.access_token.access as {
    type: "outgoing-payment";
    actions: ("create" | "read" | "read-all" | "list" | "list-all")[];
    identifier: string;
    limits?: components["schemas"]["limits-outgoing"];
  }[];

  const receiveAmount = (tokenAccessDetails[0].limits as any).receiveAmount
    ?.value;

  const { walletAddressDetails: receiverWalletAddressDetails } =
    await getWalletAddressInfo(client, input.receiverWalletAddress);

  const {
    walletAddress: senderWalletAddress,
    walletAddressDetails: senderWalletAddressDetails,
  } = await getWalletAddressInfo(
    client,
    tokenAccessDetails[0]?.identifier ?? ""
  );

  // create incoming payment
  const incomingPayment = await createIncomingPayment(
    client,
    receiveAmount!,
    receiverWalletAddressDetails
  );

  // create quote
  const quote = await createQoute(
    client,
    incomingPayment.id,
    senderWalletAddressDetails
  );

  // create outgoing payment
  try {
    const outgoingPayment = await client.outgoingPayment.create(
      {
        url: new URL(senderWalletAddress).origin,
        accessToken: token.access_token.value,
      },
      {
        walletAddress: senderWalletAddress,
        quoteId: quote.id,
      }
    );

    return outgoingPayment;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating subscription outgoing payment");
  }
}
