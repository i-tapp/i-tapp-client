// "use client";

// import usePaginator from "@/lib/hooks/use-paginator";
// import { SitePagination } from "@/components/ui/site-pagination";
// import { ApplicantCard } from "@/components/applicant-card";

// export function AllApplicants() {
//   const applicants: {}[] = Array.from({ length: 10 });

//   const { applications, setCurrentPage, postPerPage, currentPage, paginate } =
//     usePaginator(6, applicants);

//   return (
//     <div>
//       <p className="mb-4">Accepted Applicants</p>
//       {applications.map((applicant, index) => (
//         <ApplicantCard
//           key={index}
//           applicant={{
//             name: "Sam Jeremiah",
//             university: "University of FUPRE",
//           }}
//         />
//       ))}
//       <SitePagination
//         totalPosts={applicants.length}
//         postsPerPage={postPerPage}
//         paginate={paginate}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//       />
//     </div>
//   );
// }

"use client";

import usePaginator from "@/hooks/use-paginator";
import { SitePagination } from "@/components/ui/site-pagination";
import { ApplicantCard } from "@/components/applicant-card";

// Define the type for Applicant
type Applicant = {
  name: string;
  id: string;
  accepted: boolean;

  student: {
    id: string;
    firstName: string;
    lastName: string;
    school: string;
    email: string;
    profileImageUrl: string;
  };
  university: string;
};

export function AllApplicants() {
  // Array of applicants with type Applicant
  const applicants: Applicant[] = Array.from({ length: 10 });

  const { applications, setCurrentPage, postPerPage, currentPage, paginate } =
    usePaginator(6, applicants);

  return (
    <div>
      <p className="mb-4">Total Applicants</p>
      {applicants?.slice(0, 5).map((applicant: Applicant, index: number) => (
        <ApplicantCard key={index} applicant={applicant} />
      ))}
      <SitePagination
        totalPosts={applicants.length}
        postsPerPage={postPerPage}
        paginate={paginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
