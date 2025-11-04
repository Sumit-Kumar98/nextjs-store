// "use client";
// import { useAuth } from "@clerk/nextjs";
// import SelectProductAmount, { Mode } from "./SelectProductAmount";
// import SubmitButton, { ProductSignInButton } from "../form/Buttons";
// import FormContainer from "../form/FormContainer";
// import { addToCartAction } from "@/utils/action";
// import { useState } from "react";

// const AddToCart = ({ productId }: { productId: string }) => {
//   const [amount, setAmount] = useState(1);
//   const { userId } = useAuth();

//   return (
//     <div className="mt-4">
//       <SelectProductAmount
//         mode={Mode.SingleProduct}
//         amount={amount}
//         setAmount={setAmount}
//       />
//       {userId ? (
//         <FormContainer action={addToCartAction}>
//           <input type="hidden" name="productId" value={productId} />
//           <input type="hidden" name="amount" value={amount} />
//           <SubmitButton text="add to cart" className="mt-8" />
//         </FormContainer>
//       ) : (
//         <ProductSignInButton />
//       )}
//     </div>
//   );
// };

// export default AddToCart;

"use client";
import { useAuth } from "@clerk/nextjs";
import SelectProductAmount, { Mode } from "./SelectProductAmount";
import SubmitButton, { ProductSignInButton } from "../form/Buttons";
import FormContainer from "../form/FormContainer";
import { addToCartAction } from "@/utils/action";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AddToCart = ({ productId }: { productId: string }) => {
  const [amount, setAmount] = useState(1);
  const { userId } = useAuth();
  const router = useRouter();

  const handleSubmit = async (prevState: any, formData: FormData) => {
    const res = await addToCartAction(prevState, formData);
    if (res?.message === "success") {
      router.push("/cart");
    }
    return res; // ✅ must return { message: string }
  };
  return (
    <div className="mt-4">
      <SelectProductAmount
        mode={Mode.SingleProduct}
        amount={amount}
        setAmount={setAmount}
      />
      {userId ? (
        <FormContainer action={handleSubmit}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="amount" value={amount} />
          <SubmitButton text="add to cart" className="mt-8" />
        </FormContainer>
      ) : (
        <ProductSignInButton />
      )}
    </div>
  );
};

export default AddToCart;
