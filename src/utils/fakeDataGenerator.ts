export const generateFakeUsers = () => {
  return [
    { id: 1, username: 'admin', email: 'admin@system.local', role: 'SUPER_ADMIN', lastLogin: new Date().toISOString() },
    { id: 2, username: 'root', email: 'root@system.local', role: 'SYSTEM', lastLogin: new Date().toISOString() },
    { id: 3, username: 'db_admin', email: 'db_admin@system.local', role: 'DBA', lastLogin: new Date().toISOString() },
  ];
};

export const generateFakeConfig = () => {
  return {
    db_host: '10.0.0.5',
    db_user: 'postgres_admin',
    db_pass: 'hash:7d8f9e0a2b1c',
    aws_access_key: 'AKIAIOSFODNN7EXAMPLE',
    aws_secret_key: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    status: 'development'
  };
};

export const generateFakeWpAdmin = () => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>WordPress &rsaquo; Log In</title>
    <link rel="stylesheet" id="dashicons-css" href="https://wordpress.org/wp-includes/css/dashicons.min.css" type="text/css" media="all">
    <style>body{background:#f1f1f1;font-family:sans-serif;}</style>
  </head>
  <body class="login">
    <div id="login">
      <h1><a href="https://wordpress.org/">Powered by WordPress</a></h1>
      <form name="loginform" id="loginform" action="wp-login.php" method="post">
        <p>
          <label for="user_login">Username or Email Address</label>
          <input type="text" name="log" id="user_login" class="input" value="" size="20" autocapitalize="off">
        </p>
        <p>
          <label for="user_pass">Password</label>
          <input type="password" name="pwd" id="user_pass" class="input" value="" size="20">
        </p>
        <p class="submit">
          <input type="submit" name="wp-submit" id="wp-submit" class="button button-primary button-large" value="Log In">
        </p>
      </form>
    </div>
  </body>
  </html>
  `;
};
