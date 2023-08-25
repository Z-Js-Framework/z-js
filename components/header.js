export const Header = (props) => {
  let userName = props.username ? props.username : 'John Doe!';

  return `<header>
    <nav>
      <h1>Z.Js</h1>
      <p>User: ${userName}</p>
    </nav>
  </header>`;
};
