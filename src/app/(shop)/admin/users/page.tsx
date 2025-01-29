import { Title } from "@/components";
import { UserTable } from "./ui/UserTable";
import { getPaginatedUser } from "@/actions";
import { User } from "@/interfaces";
import { redirect } from "next/navigation";

export default async function UsersPage() {

  const { ok, users } = await getPaginatedUser();

  if (!ok) {
    redirect('/');
  }

  return (
    <>
      <Title title="Mantenimiento de usuarios" />
      <div className="mb-10">
        <UserTable users={users ?? [] as User[]} />
      </div>
    </>
  );
}