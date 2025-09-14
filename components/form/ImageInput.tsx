import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ImageInput = () => {
  const name = "image";
  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize mb-2">
        Image
      </Label>
      <Input id={name} name={name} type="file" required accept="image/*" />
    </div>
  );
};

export default ImageInput;
