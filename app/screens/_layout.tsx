// app/_layout.tsx
import { Slot, usePathname } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Platform, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {scaleFont} from "@/components/utils/ResponsiveFont";

export default function RootLayout() {
    const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
    const isSmallScreen = screenHeight < 700;
    const [showImage, setShowImage] = useState(!isSmallScreen);

    // Animated values
    const imagePosition = useRef(new Animated.Value(isSmallScreen ? screenHeight : screenHeight / 2 - 125)).current;
    const formPosition = useRef(new Animated.Value(screenHeight)).current;
    const imageOpacity = useRef(new Animated.Value(1)).current;
    const scrollViewOpacity = useRef(new Animated.Value(0)).current;
    const imageScale = useRef(new Animated.Value(1.5)).current;

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
        const formFinalPosition = isSmallScreen ? screenHeight * 0.1 : screenHeight * 0.025;
        const animationDuration = 1500;

        const initialAnimations = Animated.parallel([
            Animated.timing(imageOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(imagePosition, {
                toValue: isSmallScreen ? screenHeight * 0.1 : 0,
                duration: animationDuration,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(imageScale, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(formPosition, {
                toValue: formFinalPosition,
                duration: animationDuration,
                useNativeDriver: Platform.OS !== 'web',
            }),
            Animated.timing(scrollViewOpacity, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: Platform.OS !== 'web',
            }),
        ]);

        const fadeOutAnimation = Animated.timing(imageOpacity, {
            toValue: 0,
            duration: animationDuration,
            useNativeDriver: true,
        });

        const animationSequence = isSmallScreen
            ? Animated.sequence([initialAnimations, fadeOutAnimation])
            : initialAnimations;

        const timer = setTimeout(() => {
            animationSequence.start(() => {
                if (isSmallScreen) {
                    setShowImage(false);
                }
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [isSmallScreen, screenHeight]);

    // Animate Slot on route changes based on direction
    useEffect(() => {
        const initialTranslateX = direction === 'forward' ? screenWidth : -screenWidth;

        slotTranslateX.setValue(initialTranslateX);
        slotOpacity.setValue(0);

        Animated.parallel([
            Animated.timing(slotTranslateX, {
                toValue: 0,
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom cubic bezier easing for smoother animation
                useNativeDriver: true,
            }),
            Animated.timing(slotOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [pathname, direction, screenWidth]);

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
                        overflow: 'hidden',
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
        width: scaleFont(150),
        height: scaleFont(150),
        marginTop: scaleFont(60),
        marginBottom: scaleFont(0),
    },
    main: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: scaleFont(25),
        borderTopRightRadius: scaleFont(25),
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
