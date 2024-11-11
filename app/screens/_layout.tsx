// app/_layout.tsx
import { Slot, usePathname } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Platform, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RootLayout() {
    const screenHeight = Dimensions.get('window').height;
    const isSmallScreen = screenHeight < 700;

    // Initialize Animated.Values for initial animations
    const imagePosition = useRef(new Animated.Value(isSmallScreen ? screenHeight : screenHeight / 2 - 125)).current;
    const formPosition = useRef(new Animated.Value(screenHeight)).current;
    const imageOpacity = useRef(new Animated.Value(1)).current;
    const scrollViewOpacity = useRef(new Animated.Value(0)).current;
    const imageScale = useRef(new Animated.Value(1.5)).current;
    const [showImage, setShowImage] = useState(!isSmallScreen);

    // Navigation history and direction
    const [navigationStack, setNavigationStack] = useState<string[]>([]);
    const [direction, setDirection] = useState<'forward' | 'back'>('forward');
    const pathname = usePathname();

    // Animation values for Slot
    const slotTranslateX = useRef(new Animated.Value(0)).current;
    const slotOpacity = useRef(new Animated.Value(0)).current;

    // Update navigation stack and direction
    useEffect(() => {
        setNavigationStack((prevStack) => {
            const newStack = [...prevStack];
            const currentIndex = newStack.indexOf(pathname);

            if (currentIndex === -1) {
                // Navigating forward
                setDirection('forward');
                newStack.push(pathname);
            } else {
                // Navigating back
                setDirection('back');
                newStack.splice(currentIndex + 1);
            }

            return newStack;
        });
    }, [pathname]);

    // Initial animations for logo and form
    useEffect(() => {
        const formFinalPositionBottomView = isSmallScreen ? screenHeight * 0.1 : screenHeight * 0.025;
        const animationSpeed = 1500;

        // Define initial animations
        const initialAnimations = [
            Animated.timing(imageOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(imagePosition, {
                toValue: isSmallScreen ? screenHeight * 0.1 : 0, // Adjust as needed
                duration: animationSpeed,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(imageScale, {
                toValue: 1,
                duration: animationSpeed,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(formPosition, {
                toValue: formFinalPositionBottomView,
                duration: animationSpeed,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(scrollViewOpacity, {
                toValue: 1,
                duration: animationSpeed,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ];

        // Additional animation for small screens
        if (isSmallScreen) {
            initialAnimations.push(
                Animated.timing(imageOpacity, {
                    toValue: 0,
                    duration: animationSpeed,
                    useNativeDriver: true,
                })
            );
        }

        // Start initial animations after a short delay
        const timer = setTimeout(() => {
            Animated.parallel(initialAnimations).start(() => {
                if (isSmallScreen) {
                    setShowImage(false);
                }
            });
        }, 500); // Delay in milliseconds before starting the animation

        // Cleanup timeout on unmount
        return () => clearTimeout(timer);
    }, [isSmallScreen, imageOpacity, imagePosition, imageScale, formPosition, scrollViewOpacity, screenHeight]);

    // Animate Slot on route changes based on direction
    useEffect(() => {
        // Determine the initial translateX based on direction
        const initialTranslateX = direction === 'forward' ? Dimensions.get('window').width : -Dimensions.get('window').width;

        // Reset animation values
        slotTranslateX.setValue(initialTranslateX);
        slotOpacity.setValue(0);

        // Start slide-in animation
        Animated.parallel([
            Animated.timing(slotTranslateX, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(slotOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [pathname, direction, slotTranslateX, slotOpacity]);

    return (
        <LinearGradient
            colors={['#B2F7A5', '#ecffe8']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.container}
        >
            {showImage && (
                <Animated.Image
                    source={require('@/assets/images/logo.png')}
                    style={[
                        styles.logo,
                        {
                            transform: [{ translateY: imagePosition }, { scale: imageScale }],
                            opacity: imageOpacity,
                        },
                    ]}
                    resizeMode="contain"
                />
            )}
            <Animated.View
                style={[
                    styles.main,
                    {
                        transform: [{ translateY: formPosition }],
                        opacity: scrollViewOpacity,
                        height: isSmallScreen ? '100%' : screenHeight * 1.1,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        overflow: 'hidden', // Ensure this is added
                    },
                ]}
            >
                {/* Animated Slot for navigation */}
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [{ translateX: slotTranslateX }],
                        opacity: slotOpacity,
                    }}
                >
                    <Slot />
                </Animated.View>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 50,
        marginBottom: 20,
    },
    main: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 10,
            },
        }),
    },
});
