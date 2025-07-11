import { ModeToggle } from "@/components/ModeToggle";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full px-10 py-6">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h5 className="font-semibold text-3xl">END/TERM x PCCOE</h5>
        </div>
        <div className="flex flex-row items-center gap-4">
          
          <ModeToggle/>
          <Link href="">PYQs</Link>
          <Link href="">NOTEs</Link>
          <Link href="">CONTRIBUTE</Link>

        </div>
      </div>
    </div>
  );
}
