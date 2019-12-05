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
		    shoppingCart {
                soldier
                horseman
                cannon
                ship
                settler
                city
                road
                wall
		    }
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
