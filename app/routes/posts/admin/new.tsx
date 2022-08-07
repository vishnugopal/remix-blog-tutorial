import type { ActionArgs } from "@remix-run/node";

import { json, redirect } from "@remix-run/node";
import { useActionData, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createPost } from "~/models/post.server";
import { AdminPostForm } from "~/components/AdminPostForm";

export async function action({ request }: ActionArgs) {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);

  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
}

export default function NewPost() {
  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  const errors = useActionData<typeof action>();

  return <AdminPostForm errors={errors} isProcessing={isCreating} />;
}
