/**
 * Retorna a URL correta do painel baseado na role do usuário
 */
export const getRoleHomePage = (role) => {
  const roleRoutes = {
    admin: '/admin',
    gerente: '/admin',
    cozinha: '/cozinha',
    bar: '/staff/bar',
    atendente: '/atendente',
    caixa: '/staff/caixa',
    cliente: '/',
  };

  return roleRoutes[role] || '/';
};

/**
 * Redireciona para o painel correto baseado na role
 */
export const redirectToRoleHome = (router, user) => {
  if (!user || !user.role) {
    router.replace('/');
    return;
  }

  const homePage = getRoleHomePage(user.role);
  const returnTo = router.query.returnTo;

  // Se há um returnTo e o usuário tem permissão, vai para lá
  // Senão, vai para o painel da role
  if (returnTo && returnTo !== '/login' && returnTo !== '/staff/login') {
    router.replace(returnTo);
  } else {
    router.replace(homePage);
  }
};
