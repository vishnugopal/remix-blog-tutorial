import type { ActionArgs } from "@remix-run/node";

import { json, redirect } from "@remix-run/node";

import invariant from "tiny-invariant";

import { deletePost } from "~/models/post.server";

export async function action({ request }: ActionArgs) {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();
  const slug = formData.get("slug");

  const errors = {
    slug: slug ? null : "Slug is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof slug === "string", "slug must be a string");

  await deletePost(slug);

  return redirect("/posts/admin");
}
