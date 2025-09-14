"use server";

import db from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, validateWithZodSchema } from "./schemas";
import { deleteImage, uploadImage } from "./supabase";
import { revalidatePath } from "next/cache";

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
  return user;
};

const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  return products;
};

export const fetchAllProducts = async ({ search = "" }: { search: string }) => {
  return db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) redirect("/products");
  return product;
};

export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    // const name = formData.get("name") as string;
    // const company = formData.get("company") as string;
    // const price = Number(formData.get("price") as string);

    // // temp
    // const image = formData.get("image") as File;
    // const description = formData.get("description") as string;
    // const featured = Boolean(formData.get("featured") as string);
    // console.log(featured);
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;

    const validatedFields = validateWithZodSchema(productSchema, rawData);
    const validateFile = validateWithZodSchema(imageSchema, { image: file });

    const fullPath = await uploadImage(validateFile.image);

    await db.product.create({
      data: {
        ...validatedFields,
        image: fullPath,
        clerkId: user.id,
      },
    });

    // const validatedFields = productSchema.safeParse(rawData);
    // if (!validatedFields.success) {
    //   const errors = validatedFields.error.issues.map((error) => error.message);
    //   throw new Error(errors.join(","));
    // }

    // await db.product.create({
    //   data: {
    //     name,
    //     company,
    //     price,
    //     image: "/images/product-2.jpg",
    //     description,
    //     featured,
    //     clerkId: user?.id,
    //   },
    // });
    // console.log(rawData);

    // return { message: "product created!" };
  } catch (err) {
    return renderError(err);
  }
  redirect("/admin/products");
};

export const fetchAdminProducts = async () => {
  await getAdminUser();
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();
  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    revalidatePath("/admin/products");
    return { message: "product removed" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    redirect("/admin/products");
  }
  return product;
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const productId = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedFields,
      },
    });
    revalidatePath(`/admin/proucts/${productId}/edit`);
    return { message: "Product updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser();
  try {
    const image = formData.get("image") as File;
    const productId = formData.get("id") as string;
    const oldImageUrl = formData.get("url") as string;

    const validatedFile = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFile.image);
    await deleteImage(oldImageUrl);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};
