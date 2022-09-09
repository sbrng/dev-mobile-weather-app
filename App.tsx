import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getWeather } from './services/weatherAPI.service';
import Constants from 'expo-constants';

interface IFormInputs { city: '' };

let city = '';
let result;
let error = true;
let weather: IWeather;
let temp: ITemp;
let message = '';

const schema = yup.object({
  city: yup.string().required(),
}).required();

export default function App() {
  
  //test()
    
  const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });
  const onSubmit = async (data: IFormInputs) => {
    message = '';

    if (!data.city) {
      message = "Campo obrigatório";
      error = true;
    }
    
    result = await getWeather(data.city);
    
    if (result.cod && result.message) {
      message = "Cidade inválida ou não encontrada";
      error = true;
    } else {
      weather = result?.weather[0];
      temp = result?.main;
      error = false;
    }
    console.log('result', result);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cidade:</Text>
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="city"
        //rules={{ required: true }}
      />

      <View style={styles.button}>
        <Button
          style={styles.button}
          color
          title="Pesquisar"
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      <View>
        { error ? <View><Text style={styles.label}>{message}</Text></View> : <View>
            <Text style={styles.label}>Tempo atual: {weather?.description}</Text>
            <Text style={styles.label}>Temperatura: {temp?.temp}°C</Text>
            <Text style={styles.label}>Sensação Térmica: {temp?.feels_like}°C</Text>
          </View> }
      </View>

    </View>
  );
}

const test = async () => {
  console.warn(await getWeather("Recife"));
  console.log(await getWeather("São Paulo"));
}

const styles = StyleSheet.create({
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: 'white',
    height: 40,
    backgroundColor: '#ec5990',
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
    backgroundColor: '#0e101c',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});