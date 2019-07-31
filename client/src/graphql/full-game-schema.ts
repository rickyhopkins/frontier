export const fullGameSchema = `
	{
		_id
		code
		owner {
		    _id
		    name
		}
		registrations {
		    player {
		        _id
		        name
		    }
		}
	}
`;
