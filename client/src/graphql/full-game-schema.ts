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
		    _id
		    player {
		        _id
		        name
		    }
		    tiles {
                wood
                stone
                livestock
                wheat
                iron
		    }
		}
	}
`;
