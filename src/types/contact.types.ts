import { type CommunicationChannel } from "./campaign.types";

export enum ContactSortBy {
  CreatedAt = "CREATED_AT",
  Email = "EMAIL",
  FirstName = "FIRST_NAME",
  LastName = "LAST_NAME",
  PhoneNumber = "PHONE_NUMBER",
  UpdatedAt = "UPDATED_AT",
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  preferredChannel: CommunicationChannel;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  preferredChannel: CommunicationChannel;
}

export interface UpdateContactInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  preferredChannel?: CommunicationChannel;
}

export interface BulkCreateContactInput {
  contacts: CreateContactInput[];
}
