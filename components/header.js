export const Header = (props) => {
  let userName = props.username ? props.username : 'John Doe!';

  return `
  <header class="top-header">
    <nav class="header-nav">
      <h1 class="z-logo">Z.Js</h1>
      <div class="flex-row">
      <p class="username">User: ${userName}</p>
      <button class="logout-button">Log out</button>
      </div>
    </nav>
  </header>
  `;
};
