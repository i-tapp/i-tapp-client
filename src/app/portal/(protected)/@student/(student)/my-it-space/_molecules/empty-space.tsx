// import { buttonVariants } from "@/components/ui/button";
// import Link from "next/link";
// import React from "react";

import { Briefcase } from "lucide-react";

// const EmptySpace = () => {
//   return (
//     <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg lg:max-w-xl w-4/5">
//       <div className="p-6 flex flex-col items-center space-y-4">
//         <h2 className="text-xl font-semibold text-gray-800 text-center">
//           Keep refreshing this space, something good is coming...
//         </h2>
//         <p className="text-gray-500 text-center text-sm">
//           We are curating amazing IT opportunities just for you.
//         </p>
//         <Link
//           href="/portal/find-it-space"
//           className={buttonVariants({ variant: "default", size: "default" })}
//         >
//           Find IT Space
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default EmptySpace;

// Empty State Component
const EmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <Briefcase size={48} className="text-gray-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Offers Yet
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        You don&apos;t have any placement offers at the moment. Check back later
        for new opportunities.
      </p>
    </div>
  );
};

export default EmptyState;
