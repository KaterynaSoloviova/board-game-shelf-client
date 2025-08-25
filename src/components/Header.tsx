function Header() {
  return (
    <header>
      <div>
        <h1>Board Games Shelf</h1>
        <p>My personal board games library</p>
      </div>
      <nav>
        <ul style={{ listStyle: "none", display: "flex", gap: "16px" }}>
          <li><a href="/">Home</a></li>
          <li><a href="/games">My Games</a></li>
          <li><a href="/wishlist">Wishlist</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;