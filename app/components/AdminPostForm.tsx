import type { Post } from "@prisma/client";
import type { Jsonify } from "type-fest";

import { Form, useFormAction } from "@remix-run/react";

import AdminIndex from "../routes/posts/admin/index";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export function AdminPostForm(props: {
  errors?: {
    title: string | null;
    slug: string | null;
    markdown: string | null;
  };
  isProcessing: boolean;
  existingPost?: Jsonify<Post>;
}) {
  const { errors, isProcessing, existingPost } = props;

  if (isProcessing) return <AdminIndex />;

  return (
    <Form method="post">
      <p>
        <label>
          Post Title:{" "}
          {errors?.title ? (
            <em className="text-red-600">{errors.title}</em>
          ) : null}
          <input
            type="text"
            name="title"
            className={inputClassName}
            defaultValue={existingPost?.title}
            required
          />
        </label>
      </p>
      {!existingPost && (
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              type="text"
              name="slug"
              className={inputClassName}
              required
            />
          </label>
        </p>
      )}
      {existingPost?.slug && (
        <input
          type="hidden"
          name="slug"
          className={inputClassName}
          defaultValue={existingPost.slug}
        />
      )}
      <p>
        <label htmlFor="markdown">
          Markdown:{" "}
          {errors?.markdown ? (
            <em className="text-red-600">{errors.markdown}</em>
          ) : null}
        </label>
        <br />
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} font-mono`}
          defaultValue={existingPost?.markdown}
          required
        />
      </p>
      <p className="text-right">
        {existingPost && <AdminDeleteButton isProcessing={isProcessing} />}
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
          disabled={isProcessing}
        >
          {existingPost ? "Edit Post" : "Create Post"}
        </button>
      </p>
    </Form>
  );
}

function AdminDeleteButton(props: { isProcessing: boolean }) {
  const { isProcessing } = props;

  return (
    <button
      className="mr-2 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
      formAction={useFormAction("../destroy")}
      formMethod="post"
      disabled={isProcessing}
    >
      {isProcessing ? "Deleting..." : "Delete Post"}
    </button>
  );
}
