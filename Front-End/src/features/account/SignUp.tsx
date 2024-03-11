import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FieldValues, useForm } from 'react-hook-form';
import { useAppDispatch } from '../../app/store/configureStore';
import { signUpUserAsync } from '../basket/AccountSlice';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    async function submitForm(data: FieldValues){
        try{ 
            const { username, password, email } = data;
            await dispatch(signUpUserAsync({ username, password, email }));
            toast.success('Registration successful - You can now login');
            navigate('/signin');
        }
        catch(errors: any){
            for(const error of errors){
                if(error.toUpperCase().includes("USERNAME"))
                    setError('username', { message: error });
                else if(error.toUpperCase().includes("PASSWORD"))
                    setError('password', { message: error });
                else if(error.toUpperCase().includes("EMAIL"))
                    setError('email', { message: error });
            }
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                                value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                                message: 'Not a valid Email Address'
                            }
                        })}   
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        {...register('username', { 
                            required: 'Username is required' 
                        })}   
                        error={!!errors.username}
                        helperText={errors.username?.message as string}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        {...register('password', { 
                            required: 'Password is required ',
                            pattern: {
                                value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                                message: 'Password does not meet complexity requirements'
                            }
                        })}   
                        error={!!errors.password}
                        helperText={errors.password?.message as string}
                    />
                    <LoadingButton
                        disabled={!isValid}
                        loading={isSubmitting}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </LoadingButton>
                    <Grid container>
                        <Grid item>
                            <Link component={NavLink} to="/signin" variant="body2">
                                {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}