export const fullRegistrationSchema = `
_id
player {
    _id
    name
}
active
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
`;
