import { fullRegistrationSchema } from "./full-registration-schema";

export const fullGameSchema = `
	{
		_id
		code
		stage
		owner {
		    _id
		    name
		}
		registrations {
            ${fullRegistrationSchema}
		}
        trades {
            _id
            fromRegistration
            toRegistration
            outcome
            tradeValues {
                wood
                stone
                livestock
                wheat
                iron
            }
        }
	}
`;
