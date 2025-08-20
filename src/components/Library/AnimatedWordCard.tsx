import { motion } from "framer-motion";

interface Props {
  word: string;
  collected: boolean;
}

export const AnimatedWordCard = ({ word, collected }: Props) => {
  return (
    <motion.div
      className={`w-24 h-24 flex items-center justify-center rounded-lg text-center font-bold shadow-md ${
        collected ? "bg-green-300 text-black" : "bg-gray-300 text-gray-600"
      }`}
      layout
      initial={{ scale: 0 }}
      animate={{
        scale: collected ? 1.2 : 1,
        rotate: collected ? [0, 10, -10, 0] : 0,
      }}
    >
      {collected ? word : "???"}
    </motion.div>
  );
};
