 'use client';
import { Component, type ReactNode } from 'react';
import { useUniverseStore } from '@/lib/store';
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { useUniverseStore.getState().setReadingMode(true); }
  render() { return this.state.failed ? null : this.props.children; }
}
