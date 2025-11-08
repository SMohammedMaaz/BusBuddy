import { motion } from "framer-motion";
import { Bus } from "lucide-react";

const BgBuses = () => {
  const buses = [
    { id: 1, delay: 0, duration: 25, yStart: "10%", yEnd: "10%" },
    { id: 2, delay: 5, duration: 30, yStart: "30%", yEnd: "35%" },
    { id: 3, delay: 10, duration: 28, yStart: "60%", yEnd: "55%" },
    { id: 4, delay: 15, duration: 32, yStart: "80%", yEnd: "75%" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
      {buses.map((bus) => (
        <motion.div
          key={bus.id}
          className="absolute"
          initial={{ x: "-10%", y: bus.yStart }}
          animate={{
            x: "110%",
            y: bus.yEnd,
          }}
          transition={{
            duration: bus.duration,
            delay: bus.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Bus className="w-12 h-12 text-green-500 dark:text-green-400" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

export default BgBuses;
