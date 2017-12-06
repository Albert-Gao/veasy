import React from 'react';
import VeasyForm, {createInitialState} from '../../../src/index';
import TextInput from './TextInput';

const formSchema = { name: { default: 'albert' } };

class MyForm extends React.Component {
  constructor() {
    super();
    this.state = createInitialState(formSchema);
  }

  render() {
    return (
      <VeasyForm
        schema={formSchema}
        allState={this.state}
        tag="div"
        update={state => this.setState(state)}
      >
        <TextInput name="name" />
      </VeasyForm>
    );
  }
}

export default MyForm;
