import "../../../styles/admin.css";

export default function Admin() {
  return (
    <>
      <h2>Admin Dashboard</h2>
      <a href="/admin/manage-posts" className="btn btn-primary">
        Manage Posts
      </a>
      <span> </span>
      <a href="/admin/manage-users" className="btn btn-primary">
        Manage Users
      </a>
    </>
  );
}
