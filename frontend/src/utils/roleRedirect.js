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
    console.log('⚠️ REDIRECT: Sem usuário ou role, indo para /');
    router.replace('/');
    return;
  }

  const homePage = getRoleHomePage(user.role);
  const returnTo = router.query.returnTo;

  console.log('🔀 REDIRECT DEBUG:', {
    userRole: user.role,
    userName: user.nome,
    homePage,
    returnTo,
    willRedirectTo: (returnTo && returnTo !== '/login' && returnTo !== '/staff/login') ? returnTo : homePage
  });

  // Se há um returnTo e o usuário tem permissão, vai para lá
  // Senão, vai para o painel da role
  if (returnTo && returnTo !== '/login' && returnTo !== '/staff/login') {
    console.log('✅ Redirecionando para returnTo:', returnTo);
    router.replace(returnTo);
  } else {
    console.log('✅ Redirecionando para homePage:', homePage);
    router.replace(homePage);
  }
};
