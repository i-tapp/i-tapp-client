import React from "react";

import FindITSpace from "./_molecules";

export default async function page(props) {
  const searchParams = await props.searchParams;
  return <FindITSpace searchParams={searchParams} />;
}
