import { ChildEditor } from '../../components/ChildEditor';
import { useStore } from '../../store';
import { SectionHeader } from './shared';

export function ChildSection() {
  const { state, mutate } = useStore();
  return (
    <div className="stack-lg">
      <SectionHeader title="Child" />
      <div className="card pad">
        <ChildEditor
          child={state.child}
          onChange={(child) =>
            mutate((s) => {
              s.child = child;
            })
          }
        />
      </div>
    </div>
  );
}
