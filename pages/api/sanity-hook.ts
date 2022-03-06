import { VercelRequest, VercelResponse } from "@vercel/node";
import sanityClient from "../../src/sanity";
import algoliaSearch from "../../src/algolia";
import { algoliaIndexer } from "../../src/algolia";


const algolia = algoliaSearch;
const client = sanityClient;


const handler = async (req: VercelRequest, res: VercelResponse) => {


  const hook = req.query.token === undefined ? "" : req.query.token;
  if (
    req.headers["content-type"] !== "application/json" &&
    hook !== process.env.HOOK_TOKEN
  ) {
    res.status(400);
    res.json({ message: "Bad request" });
    return;
  }
  //compatibility between v1 and v2 webhook
  let _ids = [];
  if (req.body.ids === undefined){
      _ids.push(req.body._id);
  }

  console.log(`INCOMING_REQUEST:${JSON.stringify(req.body)}`);
  const sanityAlgolia = algoliaIndexer;

  return sanityAlgolia
    .webhookSync(client, (req.body.ids === undefined) ? { ids: { created: _ids, updated: [], deleted: [] }} : req.body)
    .then(() => res.status(200).send(`ok`));
};

export default handler;
