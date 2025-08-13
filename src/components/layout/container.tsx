import React from "react";

type ContainerProps = {
  children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
  return <div className="container p-6 max-w-7xl mx-auto">{children}</div>;
};
