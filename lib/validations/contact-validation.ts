import { z } from "zod";
import { stringValidation } from "./combine-validation";

export const contactPOSTSchema = z.object({
  name: stringValidation("Name"),
  lname: stringValidation("Last name"),
  email: stringValidation("Email").email("Email is must be an email format"),
  company: stringValidation("Company"),
  phone: stringValidation("Phone"),
  country: stringValidation("Country"),
  price: stringValidation("Price"),
  description: stringValidation("Description"),
  projectId: stringValidation("Project Id"),
});

export const contactPUTSchema = contactPOSTSchema.partial();
