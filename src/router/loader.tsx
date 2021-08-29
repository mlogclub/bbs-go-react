import loadable from '@loadable/component';
import Loading from '@/components/routeLoading';

const loader = (comp: any) =>
  loadable(comp, {
    fallback: <Loading />,
  });

export default loader;
