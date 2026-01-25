import Navbar from "../component/Navbar";
import { motion } from "framer-motion";

export default function Dashboard(){
  return(
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="p-6 grid grid-cols-3 gap-6">
        {[
          "Today's Mood 😇",
          "Last Assessment Score 📊",
          "Weekly Progress 📈"
        ].map(item => (
          <motion.div whileHover={{ scale:1.05 }} className="p-6 bg-white shadow rounded-xl">
            <h2 className="text-lg font-semibold">{item}</h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
