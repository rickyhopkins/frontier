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
		    stockpile {
                wood
                stone
                livestock
                wheat
                iron
		    }
		}
        trades {
            _id
            fromRegistration
            toRegistration
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
