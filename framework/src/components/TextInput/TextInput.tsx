type TextInputProps = {
  type: 'text' | 'password';
  onChange: (value: string) => void
}

export const TextInput: React.FC = ({type, onChange}) => {
  const handeInputChange = (e) => {
    onChange(e.target.value);
  }
  return <input type={type} onChange={onChange}></input>
}
