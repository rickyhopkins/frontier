export const fullGameSchema = `
	{
		_id
		code
		status
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
