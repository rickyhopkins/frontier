import * as React from "react";
import { AppWrapper } from "../../App.styles";
import { Input } from "../../components/Input";
import { ChangeEventHandler } from "react";
import { useState } from "react";
import { FIND_OPEN_GAME } from "../../graphql/find-open-game";
import { useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router";

export const GameSearch = () => {
    const [code, setCode] = useState("");

    const { data, loading } = useQuery(FIND_OPEN_GAME, {
        variables: { code },
        skip: code.length < 4,
    });

    const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.value.length > 4) return;
        setCode(e.target.value.toUpperCase());
    };

    if (data && data.findOpenGame) {
        return <Redirect push to={`/${data.findOpenGame.code}`} />;
    }

    return (
        <AppWrapper>
            <p>Search for a game</p>
            <Input
                value={code}
                onChange={handleChange}
                placeholder={"Game code"}
                hint={"4 digit code"}
                error={
                    !loading && code.length === 4
                        ? "That game code does not exist"
                        : undefined
                }
            />
        </AppWrapper>
    );
};
