import { Game } from "../mongoose/gameSchema";

export default {
    Query: {
        async registration(parent, args) {
            const game = await Game.findOne({ "registrations._id": args.id });
            // @ts-ignore
            return game.registrations.id(args.id);
        },
    },
    Mutation: {
        async buyUnit(parent, args, { injector }) {
            const game = await Game.findOne({
                "registrations._id": args.registrationId,
            });

            const updatedGame = await game.buyUnit(
                args.registrationId,
                args.unit
            );

            return (updatedGame.registrations as any).id(args.registrationId);
        },
        async sellUnit(parent, args, { injector }) {
            const game = await Game.findOne({
                "registrations._id": args.registrationId,
            });

            const updatedGame = await game.sellUnit(
                args.registrationId,
                args.unit
            );

            return (updatedGame.registrations as any).id(args.registrationId);
        },
        async endTurn(parent, args, { injector }) {
            const game = await Game.findOneAndUpdate(
                {
                    "registrations._id": args.registrationId,
                },
                {
                    set: {
                        ["registrations.$.active"]: false,
                    },
                },
                { new: true, runValidators: true }
            );

            return (game.registrations as any).id(args.registrationId);
        },
    },
};
