import React, { useState } from "react";

const { Magic } = require("magic-sdk");

const public_magic_key = process.env.PAYLOAD_PUBLIC_PUBLIC_MAGIC_KEY;

const endpoint = `${process.env.PAYLOAD_PUBLIC_BASE_URL}/api/users/magic/login`;

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState<false | true>(false);

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      event.stopPropagation();
      const magic = new Magic(public_magic_key);

      const form = event.target;
      const data = new FormData(form);
      const formEmail = data.get("email");

      const body = {
        email: formEmail,
        name: "payload",
      };

      const didToken = await magic.auth.loginWithMagicLink({
        email: body.email,
      });

      setIsSubmitting(true);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify(body),
      });

      console.log(response);
    } catch (error) {
      console.log("An unexpected error happened occurred:", error);
    }
  }

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <label htmlFor="email">Enter your email: </label>
      <input type="email" name="email" id="email" required />
      <button type="submit">{isSubmitting ? "🚀" : "Send"}</button>
    </form>
  );
}
