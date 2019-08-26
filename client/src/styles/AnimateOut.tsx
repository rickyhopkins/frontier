import * as React from "react";
import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface IProps {
    active: boolean;
}

export const AnimateOut: FC<IProps> = ({ children, active }) => {
    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};
