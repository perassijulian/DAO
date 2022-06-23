import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-red-500 w-full h-10 text-white p-1 flex justify-around items-center">
      <Link href="/">
        <a className="cursor-pointer hover:opacity-50 p-2">
          <h2 className="">DAO</h2>
        </a>
      </Link>
      <div className="flex gap-3 items-center">
        <Link href="/proposals/vote">
          <a className="cursor-pointer hover:opacity-50 p-2">VOTE</a>
        </Link>
        <Link href="/proposals/new">
          <a className="cursor-pointer hover:opacity-50 p-2">ADD</a>
        </Link>
        <Link href="/proposals">
          <a className="cursor-pointer hover:opacity-50 p-2">PROPOSALS</a>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
