import type { ActionArgs, LoaderArgs } from "@remix-run/node";

import { redirect, json } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { AdminPostForm } from "~/components/AdminPostForm";
import invariant from "tiny-invariant";

import { editPost, getPost } from "~/models/post.server";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
}

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

  await editPost(slug, { title, markdown });

  return redirect("/posts/admin");
}

export default function EditPost() {
  const transition = useTransition();
  const isEditing = Boolean(transition.submission);

  const { post } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  return (
    <AdminPostForm
      errors={errors}
      isProcessing={isEditing}
      existingPost={post}
    />
  );
}
