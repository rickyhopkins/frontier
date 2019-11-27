import * as React from "react";
import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const AnimateOut: FC = ({ children }) => {
    return (
        <AnimatePresence>
            {React.Children.map(children, child => {
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {child}
                    </motion.div>
                );
            })}
        </AnimatePresence>
    );
};
