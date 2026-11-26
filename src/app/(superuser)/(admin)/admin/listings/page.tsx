import ListingsTable from "./_molecules/listings-table";
import UndeliveredPanel from "./_molecules/undelivered-panel";

export default function ListingsPage() {
  return (
    <>
      <UndeliveredPanel />
      <ListingsTable />
    </>
  );
}
