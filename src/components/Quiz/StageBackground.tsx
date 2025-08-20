import { useQuizStore } from "../../stores/quizStore";
import { motion } from "motion/react";

export const StageBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const theme = useQuizStore((state) => state.getCurrentTheme());

  return (
    <motion.div
      key={theme.name} // ステージ変更時にアニメーション発火
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen p-4 ${theme.bgColor} bg-cover bg-center`}
      style={{
        backgroundImage: theme.bgImage ? `url(${theme.bgImage})` : undefined,
      }}
    >
      {children}
    </motion.div>
  );
};
